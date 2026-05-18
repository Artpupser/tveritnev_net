using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Routing;
using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App;

public sealed class TveritnevNetApp(
   IConfiguration configuration,
   IValidatorManager validator,
   IRouter router,
   ILogger<TveritnevNetApp> logger)
   : WebApp(configuration, router, validator,
      logger);