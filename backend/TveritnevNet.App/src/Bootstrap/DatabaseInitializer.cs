using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using PupaMVCF.Framework.Database;

using TveritnevNet.App.Repositories;
using TveritnevNet.App.Utils;
using PupaMVCF.Framework.Core;

namespace TveritnevNet.App.Bootstrap;

public sealed class DatabaseInitializer(
   IDatabaseConnectionFactory connectionFactory,
   PublicFolder publicFolder,
   IConfiguration configuration)
// ILogger<DatabaseInitializer> logger) 
   {

   public async Task InitUsersInDatabase(CancellationToken cancellationToken)
    {
        var userRepo = new UserRepository(connectionFactory);
        var username = configuration["ADMIN_USERNAME"] ??
                       throw new Exception("username admin not found in startup configuration");
        if (await userRepo.ExistsAsync("username", username, cancellationToken)) return;
        var password = CryptoUtils.Sha256(configuration["ADMIN_PASSWORD"] ??
                                          throw new Exception("password admin not found in startup configuration"));
        await userRepo.CreateAdmin(username, password, cancellationToken);
    }

    public async Task InitConfigInDatabase(CancellationToken cancellationToken)
    {
        var configsRepo = new ConfigsRepository(connectionFactory);
        var fileNames = new[] { "site", "settings" };

        foreach (var fileName in fileNames)
        {
            var fullFileName = $"default.{fileName}.json";
            var fileOption = publicFolder.Virtual.GetFileIn(fullFileName);
            if (!fileOption.Out(out var file)) throw new Exception($"Default config not found, {fullFileName}");

            var jsonOption = await file.ReadStringAsync(cancellationToken);
            if (!jsonOption.Out(out var json) && string.IsNullOrWhiteSpace(json)) throw new Exception($"Default configs is empty, {fullFileName}");

            var defaultFileName = $"default_{fileName}";

            if (!await configsRepo.ExistsAsync("name", defaultFileName, cancellationToken))
                await configsRepo.Create(defaultFileName, json, cancellationToken);

            if (!await configsRepo.ExistsAsync("name", fileName, cancellationToken))
                await configsRepo.Create(fileName, json, cancellationToken);
        }
    }
}
