using System.Text.Json;

using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Models.Database;
using TveritnevNet.App.Repositories;
using TveritnevNet.App.Utils;

namespace TveritnevNet.App.Controllers;

public sealed class ModeratorController(IDatabaseConnectionFactory databaseConnectionFactory) : Controller {
   private readonly ModeratorRepository _moderatorRepository = new(databaseConnectionFactory);
   private readonly SessionRepository _sessionRepository = new(databaseConnectionFactory);
   
   [ControllerHandler("/moderator/login", HttpMethodType.POST, typeof(ModifyLoggerMiddleware))]
   private async Task ModeratorLoginHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<LoginModel>(request, response, cancellationToken)).Out(out var loginModel)) {
         return;
      }

      if (!(await _moderatorRepository.FirstWhere("username", loginModel.Username, cancellationToken)).Out(out var moderatorDatabaseModel) || moderatorDatabaseModel.PasswordHash != CryptoUtils.Sha256(loginModel.Password)) {
         response.PushError($"Username or password wrong.");
         return;
      }

      if (request.GetCookie("Token").Out(out var token)) {
         if (!(await _sessionRepository.FirstWhere("user_id", moderatorDatabaseModel.Id, cancellationToken)).Out(out var sessionDatabaseModel) ) {
            await _sessionRepository.Create(moderatorDatabaseModel.Id, token, cancellationToken);
         } else {
            await _sessionRepository.Regenerate(moderatorDatabaseModel.Id, token, cancellationToken);
         }
      }
      
      response.WriteStrToCache("Success");
   } 
}