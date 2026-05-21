
using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Models.Database;
using TveritnevNet.App.Repositories;
using TveritnevNet.App.Utils;

namespace TveritnevNet.App.Controllers;

public sealed class UsersController(IDatabaseConnectionFactory databaseConnectionFactory) : Controller {
   private readonly UserRepository _userRepository = new(databaseConnectionFactory);
   private readonly SessionRepository _sessionRepository = new(databaseConnectionFactory);

   #region GET

   [ControllerHandler("/users/me", HttpMethodType.GET, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
   private async Task UsersMeHandler(Request request, Response response, CancellationToken cancellationToken) {
      var usersDatabaseModel = request.FeatureCollection.Get<UsersDatabaseModel>();
      response.WriteTJsonToCache(new {Username=usersDatabaseModel.Username, Password=usersDatabaseModel.Password, Role=usersDatabaseModel.Role});
   }
   
   [ControllerHandler("/users/me/role", HttpMethodType.GET, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
   private async Task UsersMeRoleHandler(Request request, Response response, CancellationToken cancellationToken) {
      var usersDatabaseModel = request.FeatureCollection.Get<UsersDatabaseModel>();
      response.WriteTJsonToCache(new {Role=usersDatabaseModel.Role});
   }
   
   [ControllerHandler("/users/me/username", HttpMethodType.GET, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
   private async Task UsersMeUsernameHandler(Request request, Response response, CancellationToken cancellationToken) {
      var usersDatabaseModel = request.FeatureCollection.Get<UsersDatabaseModel>();
      response.WriteTJsonToCache(new {Username=usersDatabaseModel.Username});
   }
   
   [ControllerHandler("/users/me/id", HttpMethodType.GET, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
   private async Task UsersMeIdHandler(Request request, Response response, CancellationToken cancellationToken) {
      var usersDatabaseModel = request.FeatureCollection.Get<UsersDatabaseModel>();
      response.WriteTJsonToCache(new {Id=usersDatabaseModel.Id});
   }
   
   #endregion
   
   #region POST
   
   [ControllerHandler("/users/login", HttpMethodType.POST, typeof(ModifyLoggerMiddleware))]
   private async Task UsersLoginHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<LoginModel>(request, response, cancellationToken)).Out(out var loginModel)) {
         return;
      }

      if (!(await _userRepository.FirstWhere("username", loginModel.Username, cancellationToken)).Out(out var usersDatabaseModel) || usersDatabaseModel.Password != CryptoUtils.Sha256(loginModel.Password)) {
         response.PushError($"Username or password wrong.");
         return;
      }

      if (request.GetCookie("Token").Out(out var token)) {
         if (!(await _sessionRepository.FirstWhere("user_id", usersDatabaseModel.Id, cancellationToken)).Out(out var sessionDatabaseModel) ) {
            await _sessionRepository.Create(usersDatabaseModel.Id, token, cancellationToken);
         } else {
            await _sessionRepository.Regenerate(usersDatabaseModel.Id, token, cancellationToken);
         }
      }
      
      response.WriteStrToCache("success");
   } 
   
   [ControllerHandler("/users/change_password", HttpMethodType.POST, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
   private async Task UsersChangePasswordHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ChangePasswordModel>(request, response, cancellationToken)).Out(out var changePasswordModel)) {
         return;
      }

      var usersDatabaseModel = request.FeatureCollection.Get<UsersDatabaseModel>();

      if (usersDatabaseModel.Password == CryptoUtils.Sha256(changePasswordModel.CurrentPassword)) {
         response.PushError("Current password is wrong.");
         return;
      }
      
      if (changePasswordModel.RepeatPassword == changePasswordModel.NewPassword) {
         response.PushError("New password not equal with repeat password.");
         return;
      }


      if (!await _userRepository.ChangeFrom("id", usersDatabaseModel.Id, "password",
             CryptoUtils.Sha256(changePasswordModel.NewPassword), cancellationToken)) {
         response.PushError("Wrong change password.");
         return;
      }
      
      response.WriteStrToCache("success");
   } 

   
   [ControllerHandler("/users/logout", HttpMethodType.POST, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
   private async Task UsersLogoutHandler(Request request, Response response, CancellationToken cancellationToken) {
      var usersDatabaseModel = request.FeatureCollection.Get<UsersDatabaseModel>();

      if ((await _sessionRepository.Delete("user_id", usersDatabaseModel.Id.ToString(), cancellationToken)).Out(out _) ) {
         response.WriteStrToCache("success");
         return;
      } 
      response.PushError("Logout failed");
      
   } 
   
   #endregion
}
