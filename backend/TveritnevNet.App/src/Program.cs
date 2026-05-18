using Dapper;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Npgsql;

using PupaLib.FileIO;

using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Middleware;
using PupaMVCF.Framework.Routing;
using PupaMVCF.Framework.Validations;
using PupaMVCF.Framework.Validations.Modules;

using TveritnevNet.App.Controllers;
using TveritnevNet.App.Middleware;
using TveritnevNet.App.Repositories;
using TveritnevNet.App.Utils;
using TveritnevNet.App.Validators;

namespace TveritnevNet.App;

public static class Program {

   private static async Task InitAdmin(IDatabaseConnectionFactory connectionFactory, IConfiguration configuration, CancellationToken cancellationToken) {
      var moderatorRepo = new ModeratorRepository(connectionFactory);
      if (await moderatorRepo.ExistsAsync("id", 1, cancellationToken)) {
         return;
      }
      await moderatorRepo.Create(
         configuration["ADMIN_USERNAME"] ?? throw new Exception("username admin not found in startup configuration"), 
         CryptoUtils.Sha256(configuration["ADMIN_PASSWORD"] ?? throw new Exception("password admin not found in startup configuration")), cancellationToken);
   }
   
   private static async Task InitConfiguration(IDatabaseConnectionFactory connectionFactory, CancellationToken cancellationToken) {
      var configurationRepo = new ConfigurationRepository(connectionFactory);
      var publicFolder = VirtualIo.RootFolder.GetFolderIn("public") ?? throw new Exception("Public folder not found :(");
      var fileSettings = publicFolder.GetFileIn("default.settings.json");
      var filePanel = publicFolder.GetFileIn("default.panel.json");
      if (fileSettings is null || filePanel is null) {
         throw new Exception("Default configs not found :(");
      }
      
      var jsonPanel = await filePanel.ReadStringAsync(cancellationToken);
      var jsonSettings = await fileSettings.ReadStringAsync(cancellationToken);
      
      if (string.IsNullOrWhiteSpace(jsonPanel) || string.IsNullOrWhiteSpace(jsonSettings)) {
         throw new Exception("Default configs is empty");
      }

      if (!await configurationRepo.ExistsAsync("id", 1, cancellationToken)) {
         await configurationRepo.CreateSafe(jsonPanel, jsonSettings, cancellationToken);
      }
      
      if (!await configurationRepo.ExistsAsync("id", 2, cancellationToken)) {
         await configurationRepo.CreateSafe(jsonPanel, jsonSettings, cancellationToken);
      }
   }
   
   private static async Task Main(string[] args) {
      dotenv.net.DotEnv.Load();
      Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
      var builder = Host.CreateApplicationBuilder(args);
      builder.Configuration.AddEnvironmentVariables();
      builder.Services.AddSingleton<IValidatorManager, ModifyValidatorManager>(_ =>
         new ModifyValidatorManager(builder.Configuration,
         [
            new NeedValidatorModule(), new EmailValidatorModule(), new NumberRangeValidatorModule(),
            new StringRangeValidatorModule(), new CloudflareCaptchaValidatorModule(), new JsonValidatorModule() 
         ]));
      builder.Services.AddSingleton<IDatabaseConnectionFactory, DatabaseConnectionFactory<NpgsqlConnection>>();
      builder.Services.AddScoped<LoggerMiddleware>();
       builder.Services.AddScoped<ModeratorSessionMiddleware>();
       builder.Services.AddScoped<ModifyLoggerMiddleware>();
      
      builder.Services.AddScoped<ErrorControllerOnlyJson>();
      builder.Services.AddScoped<StaticController>();
      builder.Services.AddScoped<ModeratorController>();
       builder.Services.AddScoped<ConfigurationController>();
      
      builder.Services.AddSingleton<RouterMapBuilder>(_ => {
         var routerMapBuilder = new RouterMapBuilder();
         routerMapBuilder.AddController<StaticController>();
         routerMapBuilder.AddController<ErrorControllerOnlyJson>();
         routerMapBuilder.AddController<ConfigurationController>();
         routerMapBuilder.AddController<ModeratorController>();
         return routerMapBuilder;
      });
      builder.Services.AddSingleton<IRouter, Router>();
      builder.Services.AddHostedService<TveritnevNetApp>();
      var host = builder.Build();
      // BAD CODE >>>
      var cts = new CancellationTokenSource();
      await Task.Delay(TimeSpan.FromSeconds(5), cts.Token);
      await InitAdmin(host.Services.GetRequiredService<IDatabaseConnectionFactory>(), host.Services.GetRequiredService<IConfiguration>(), cts.Token);
      await InitConfiguration(host.Services.GetRequiredService<IDatabaseConnectionFactory>(),  cts.Token);
      cts.Dispose();
      // END BAD CODE <<<      
      await host.RunAsync();
   }
}