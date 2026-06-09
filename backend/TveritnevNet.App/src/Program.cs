using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Npgsql;

using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Routing;
using PupaMVCF.Framework.Validations;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Generators;


namespace TveritnevNet.App;

public static class Program
{
    private static async Task Main(string[] args)
    {
        dotenv.net.DotEnv.Load();
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        var builder = Host.CreateApplicationBuilder(args);
        builder.Configuration.AddEnvironmentVariables();
        await InitializatorBuilder.Except([]);
        builder.Services.AddSingleton<PublicFolder>();
        builder.Services.AddSingleton<JwtTokenGeneratorService>();
        builder.Services.AddSingleton<IDatabaseConnectionFactory, DatabaseConnectionFactory<NpgsqlConnection>>();
        builder.Services.AddSingleton<IValidatorManager, ValidatorManager>();
        await InitializatorBuilder.PreloadMvcComponents(builder.Services);
        builder.Services.AddSingleton<IRouter, Router>();
        builder.Services.AddSingleton<IWebAppBootstrap, TveritnevNetAppBootstrap>();
        builder.Services.AddHostedService<TveritnevNetApp>();
        var host = builder.Build();
        await host.RunAsync();
    }
}
