using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Middleware;
using PupaMVCF.Framework.Routing;
using PupaMVCF.Framework.Validations;
using PupaMVCF.Framework.Validations.Modules;
using TveritnevNet.App.Controllers;
using TveritnevNet.App.Middleware;

namespace TveritnevNet.App;

public static class Program {
   private static async Task Main(string[] args) {
      dotenv.net.DotEnv.Load();
      var builder = Host.CreateApplicationBuilder(args);
      builder.Configuration.AddEnvironmentVariables();
      builder.Services.AddSingleton<IValidatorManager, ModifyValidatorManager>(_ =>
         new ModifyValidatorManager(builder.Configuration,
         [
            new NeedValidatorModule(), new EmailValidatorModule(), new NumberRangeValidatorModule(),
            new StringRangeValidatorModule(), new CloudflareCaptchaValidatorModule()
         ]));
      builder.Services.AddScoped<LoggerMiddleware>();
      builder.Services.AddScoped<TemplateMiddleware>();
      builder.Services.AddScoped<UserController>();
      builder.Services.AddScoped<ErrorControllerOnlyJson>();
      builder.Services.AddScoped<StaticController>();
      builder.Services.AddSingleton<RouterMapBuilder>(_ => {
         var routerMapBuilder = new RouterMapBuilder();
         routerMapBuilder.AddController<StaticController>();
         routerMapBuilder.AddController<ErrorControllerOnlyJson>();
         routerMapBuilder.AddController<UserController>();
         return new RouterMapBuilder();
      });
      builder.Services.AddSingleton<IRouter, Router>();
      builder.Services.AddHostedService<TveritnevNetApp>();
      var host = builder.Build();
      await host.RunAsync();
   }
}