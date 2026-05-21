using System.Text.RegularExpressions;

using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Controllers;


public sealed class ConfigurationController : Controller {
   private readonly UserRepository _userRepository;
   private readonly SessionRepository _sessionRepository;
   private readonly ConfigsRepository _configsRepository;
   private readonly string[] _wrongWords = ["admin", "moderator", "default"];
   private readonly string _pattern;

   public ConfigurationController(IDatabaseConnectionFactory databaseConnectionFactory) {
      _userRepository = new UserRepository(databaseConnectionFactory);
      _sessionRepository = new SessionRepository(databaseConnectionFactory);
      _configsRepository = new ConfigsRepository(databaseConnectionFactory);
      _pattern = $"({string.Join("|", _wrongWords.Select(Regex.Escape))})";
   }
   
   #region GET
   
   [ControllerHandler("/configs/load", HttpMethodType.GET, typeof(ModifyLoggerMiddleware))]
   private async Task GetConfigsLoadHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ConfigLoadModel>(request, response, cancellationToken)).Out(out var configLoadModel)) {
         return;
      }

      if (CheckWrongWords(configLoadModel.Name)) {
         response.PushError("Your query contains prohibited words");
         return;
      }

      if (!(await _configsRepository.FirstWhere("name", configLoadModel.Name, cancellationToken)).Out(out var configsDatabaseModel)) {
         response.PushError("Error load config from storage");
         return;
      }

      response.WriteTJsonToCache(configsDatabaseModel);
   }
   
   [ControllerHandler("/configs/default", HttpMethodType.GET, typeof(ModifyLoggerMiddleware), typeof(AdminSessionMiddleware))]
   private async Task GetConfigsDefaultHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ConfigLoadModel>(request, response, cancellationToken)).Out(out var configLoadModel)) {
         return;
      }

      if (!(await _configsRepository.FirstWhere("name", $"default_{configLoadModel.Name}", cancellationToken)).Out(out var configsDatabaseModel)) {
         response.PushError("Error load config from storage");
         return;
      }

      response.WriteTJsonToCache(configsDatabaseModel);
   }
   
   #endregion

   #region POST
   
   [ControllerHandler("/configs/save", HttpMethodType.POST, typeof(ModifyLoggerMiddleware), typeof(AdminSessionMiddleware))]
   private async Task ConfigsSavePanelHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ConfigSaveModel>(request, response, cancellationToken)).Out(out var configSaveModel)) {
         return;
      }
      
      if (CheckWrongWords(configSaveModel.Name)) {
         response.PushError("Your query contains prohibited words");
         return;
      }

      if (await _configsRepository.ChangeFrom("name", configSaveModel.Name, "json", configSaveModel.Json, cancellationToken)) {
         response.WriteStrToCache("");
         return;
      }
      
      response.PushError("Change config is wrong");
   }
   
   #endregion
   
   private bool CheckWrongWords(string content) {
      return Regex.IsMatch(_pattern, content, RegexOptions.IgnoreCase);
   }

}