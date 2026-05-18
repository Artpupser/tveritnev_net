using Microsoft.Extensions.Logging;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Middleware;

namespace TveritnevNet.App.Middleware;

public sealed class ModifyLoggerMiddleware(ILogger<ModifyLoggerMiddleware> logger) : IMiddleware {
   public Task<Option> Invoke(Request request, Response response, CancellationToken cancellationToken) {
      logger.LogInformation($"REQUEST:\n\tToken: {request.GetCookie("Token")}\n\tPath: {request.Path}\n\tIpV4: {request.IpAddress.ToString()}\n");
      return Option.OkTask();
   }
}