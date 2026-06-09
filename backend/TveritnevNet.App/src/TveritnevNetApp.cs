using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Routing;
using PupaMVCF.Framework.Generators;


namespace TveritnevNet.App;

public sealed class TveritnevNetApp(
   IConfiguration configuration,
   JwtTokenGeneratorService jwtGenerator,
   IRouter router,
   ILogger<TveritnevNetApp> logger, IWebAppBootstrap webAppBootstrap)
   : WebApp(configuration, jwtGenerator, router,
      logger, webAppBootstrap)
{ }
