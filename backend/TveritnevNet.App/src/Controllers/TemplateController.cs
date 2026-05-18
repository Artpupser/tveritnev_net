using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Middleware;

using TveritnevNet.App.Middleware;

namespace TveritnevNet.App.Controllers;

public sealed class UserController : Controller {
   [ControllerHandler("/users/me", HttpMethodType.GET, typeof(LoggerMiddleware), typeof(TemplateMiddleware))]
   private async Task UsersMeHandler(Request request, Response response, CancellationToken cancellationToken) {
      response.WriteStrToCache("Hello");
      await Task.CompletedTask;
   }

}