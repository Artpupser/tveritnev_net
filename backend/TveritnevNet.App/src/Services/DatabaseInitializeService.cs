using Microsoft.Extensions.Configuration;

using PupaLib.FileIO;

using PupaMVCF.Framework.Database;

using TveritnevNet.App.Repositories;
using TveritnevNet.App.Utils;

namespace TveritnevNet.App.Services;

public sealed class DatabaseInitializeService {
   private readonly IDatabaseConnectionFactory _connectionFactory;
   private readonly IConfiguration _configuration;

   public DatabaseInitializeService(IDatabaseConnectionFactory connectionFactory, IConfiguration configuration) {
      _connectionFactory = connectionFactory;
      _configuration = configuration;
      Task.Run(async () => {
         await Task.Delay(TimeSpan.FromSeconds(5));
         await TimeCallback();
      });
   }

   private async Task InitUsersInDatabase(CancellationToken cancellationToken) {
      var userRepo = new UserRepository(_connectionFactory);
      var username = _configuration["ADMIN_USERNAME"] ??
                     throw new Exception("username admin not found in startup configuration");
      if (await userRepo.ExistsAsync("username", username, cancellationToken)) {
         return;
      }
      var password = CryptoUtils.Sha256(_configuration["ADMIN_PASSWORD"] ?? 
                                        throw new Exception("password admin not found in startup configuration"));
      await userRepo.CreateAdmin(username, password, cancellationToken);
   }
   
   private async Task InitConfigInDatabase(CancellationToken cancellationToken) {
      var configsRepo = new ConfigsRepository(_connectionFactory);
      var publicFolder = VirtualIo.RootFolder.GetFolderIn("public") ?? throw new Exception("Public folder not found :(");
      var fileNames = new[] { "site", "settings" };

      foreach (var fileName in fileNames) {
         var fullFileName = $"default.{fileName}.json";
         var file = publicFolder.GetFileIn(fullFileName);
         if (file is null) {
            throw new Exception($"Default config not found, {fullFileName}");
         }

         var json = await file.ReadStringAsync(cancellationToken);
         if (string.IsNullOrWhiteSpace(json)) {
            throw new Exception($"Default configs is empty, {fullFileName}");
         }

         var defaultFileName = $"default_{file}";
         
         if (!await configsRepo.ExistsAsync("name", defaultFileName, cancellationToken)) {
            await configsRepo.Create(defaultFileName, json, cancellationToken);
         }
         
         if (!await configsRepo.ExistsAsync("name", fileName, cancellationToken)) {
            await configsRepo.Create(fileName, json, cancellationToken);
         }
      }
   }

   public async Task TimeCallback() {
      var cts = new CancellationTokenSource();
      await InitUsersInDatabase(cts.Token);
      await InitConfigInDatabase(cts.Token);
   }
}