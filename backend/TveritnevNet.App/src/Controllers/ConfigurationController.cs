using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Controllers;

public sealed class ConfigurationController(IDatabaseConnectionFactory databaseConnectionFactory) : Controller {
   private readonly ModeratorRepository _moderatorRepository = new(databaseConnectionFactory);
   private readonly SessionRepository _sessionRepository = new(databaseConnectionFactory);
   private readonly ConfigurationRepository _configurationRepository = new(databaseConnectionFactory);

   #region GET

   [ControllerHandler("/configuration/panel", HttpMethodType.GET, typeof(ModifyLoggerMiddleware))]
   private async Task GetConfigurationPanelHandler(Request request, Response response, CancellationToken cancellationToken) {
      var contentOption = await _configurationRepository.FirstPanel(cancellationToken);
      if (contentOption.Out(out var content)) {
         response.MimeContentType = MimeContentType.Json;
         response.WriteStrToCache(content);
      }
      response.PushError("Error with deserialize json");
   }
   
   [ControllerHandler("/configuration/settings", HttpMethodType.GET, typeof(ModifyLoggerMiddleware),
      typeof(ModeratorSessionMiddleware))]
   private async Task GetConfigurationSettingsHandler(Request request, Response response, CancellationToken cancellationToken) {
      var contentOption = await _configurationRepository.FirstSettings(cancellationToken);
      if (contentOption.Out(out var content)) {
         response.MimeContentType = MimeContentType.Json;
         response.WriteStrToCache(content);
      }
      response.PushError("Error with deserialize json");
   }
   
   #endregion

   #region POST
   
   [ControllerHandler("/configuration/save", HttpMethodType.POST, typeof(ModifyLoggerMiddleware), typeof(ModeratorSessionMiddleware))]
   private async Task PostConfigurationPanelHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ConfigurationModel>(request, response, cancellationToken)).Out(out var configurationModel)) {
         return;
      }

      if (await _configurationRepository.Refresh(configurationModel, 1, cancellationToken)) {
         response.WriteStrToCache("success");
         return;
      }
      response.PushError("Error with deserialize json");
   }
   
   
   #endregion
}