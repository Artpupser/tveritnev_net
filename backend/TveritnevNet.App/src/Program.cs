
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Npgsql;


using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Middleware;
using PupaMVCF.Framework.Routing;
using PupaMVCF.Framework.Validations;
using PupaMVCF.Framework.Validations.Modules;

using TveritnevNet.App.Controllers;
using TveritnevNet.App.Middleware;
using TveritnevNet.App.Services;
using TveritnevNet.App.Validators;

namespace TveritnevNet.App;

public static class Program {
   private static async Task Main(string[] args) {
      dotenv.net.DotEnv.Load();
      Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
      var builder = Host.CreateApplicationBuilder(args);
      builder.Configuration.AddEnvironmentVariables();
      builder.Services.AddSingleton<IValidatorManager, ModifyValidatorManager>(_ =>
         new ModifyValidatorManager(builder.Configuration,
         [
            new NeedValidatorModule(), new EmailValidatorModule(), new NumberRangeValidatorModule(),
            new StringRangeValidatorModule(), new CloudflareCaptchaValidatorModule(), new ImageValidatorModule(), new JsonValidatorModule() 
         ]));
      builder.Services.AddSingleton<IDatabaseConnectionFactory, DatabaseConnectionFactory<NpgsqlConnection>>();
      builder.Services.AddScoped<LoggerMiddleware>();
       builder.Services.AddScoped<AdminSessionMiddleware>();
       builder.Services.AddScoped<ModifyLoggerMiddleware>();
      
      builder.Services.AddScoped<ErrorControllerOnlyJson>();
      builder.Services.AddScoped<StaticController>();
      builder.Services.AddScoped<UsersController>();
       builder.Services.AddScoped<ConfigsController>();
       builder.Services.AddScoped<ImagesController>();
      
      builder.Services.AddSingleton<RouterMapBuilder>(_ => {
         var routerMapBuilder = new RouterMapBuilder();
         routerMapBuilder.AddController<StaticController>();
         routerMapBuilder.AddController<ErrorControllerOnlyJson>();
         routerMapBuilder.AddController<ConfigsController>();
         routerMapBuilder.AddController<UsersController>();
         routerMapBuilder.AddController<ImagesController>();
         return routerMapBuilder;
      });
      builder.Services.AddSingleton<IRouter, Router>();
      builder.Services.AddSingleton<DatabaseInitializeService>();
      builder.Services.AddHostedService<TveritnevNetApp>();
      var host = builder.Build();
      host.Services.GetRequiredService<DatabaseInitializeService>();
      await host.RunAsync();
   }
}