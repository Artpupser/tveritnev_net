using Microsoft.Extensions.Logging;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Middleware;

namespace TveritnevNet.App.Middleware;

public sealed class ModifyLoggerMiddleware(ILogger<ModifyLoggerMiddleware> logger) : IMiddleware {
   public Task<Option> Invoke(Request request, Response response, CancellationToken cancellationToken) {
      logger.LogInformation("REQUEST:\n\tToken: {GetCookie}\n\tPath: {RequestPath}\n\tIpV4: {ToString}\n",
         request.GetCookie("Token"), request.Path, request.IpAddress.ToString());
      return Option.OkTask();
   }
}