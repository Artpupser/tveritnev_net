using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Validations;
using PupaMVCF.Framework.Generators;
using System.Security.Claims;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Models.Database;
using TveritnevNet.App.Repositories;
using TveritnevNet.App.Utils;


namespace TveritnevNet.App.Controllers;

[InitializatorEye(true)]
[ControllerScheme("/users")]
public sealed class UsersController(IValidatorManager validatorManager, JwtTokenGeneratorService jwtTokenGeneratorService, IDatabaseConnectionFactory databaseConnectionFactory) : Controller
{
    private readonly UserRepository _userRepository = new(databaseConnectionFactory);
    private readonly SessionRepository _sessionRepository = new(databaseConnectionFactory);

    #region GET

    [ControllerHandler("/me", HttpMethodType.GET, typeof(ModifyLoggerMiddleware), typeof(MemberSessionMiddleware))]
    private async Task UsersMeHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        var userDatabaseModel = request.FeatureCollection.Get<UserDatabaseModel>()!;
        response.WriteTJsonToCache(new
        {
            username = userDatabaseModel.Username,
            role = userDatabaseModel.Role,
            id = userDatabaseModel.Id
        });
    }

    [ControllerHandler("/me/role", HttpMethodType.GET, typeof(ModifyLoggerMiddleware),
       typeof(MemberSessionMiddleware))]
    private async Task UsersMeRoleHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        var userDatabaseModel = request.FeatureCollection.Get<UserDatabaseModel>()!;
        response.WriteTJsonToCache(new { role = userDatabaseModel.Role });
    }

    [ControllerHandler("/me/username", HttpMethodType.GET, typeof(ModifyLoggerMiddleware),
       typeof(MemberSessionMiddleware))]
    private async Task UsersMeUsernameHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        var userDatabaseModel = request.FeatureCollection.Get<UserDatabaseModel>()!;
        response.WriteTJsonToCache(new { username = userDatabaseModel.Username });
    }

    [ControllerHandler("/me/id", HttpMethodType.GET, typeof(ModifyLoggerMiddleware),
       typeof(MemberSessionMiddleware))]
    private async Task UsersMeIdHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        var userDatabaseModel = request.FeatureCollection.Get<UserDatabaseModel>()!;
        response.WriteTJsonToCache(new { id = userDatabaseModel.Id });
    }

    #endregion

    #region POST

    [ControllerHandler("/login", HttpMethodType.POST, typeof(ModifyLoggerMiddleware))]
    private async Task UsersLoginHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await validatorManager.ValidFromRequest<LoginModel>(request, response, cancellationToken)).Out(
               out var loginModel)) return;

        if (!(await _userRepository.WhereOneAsync("username", loginModel.Username, cancellationToken)).Out(
               out var usersDatabaseModel) || usersDatabaseModel.Password != CryptoUtils.Sha256(loginModel.Password))
        {
            response.PushError($"Username or password wrong.");
            return;
        }

        var token = await jwtTokenGeneratorService.GenerateJwt(DateTimeOffset.UtcNow + TimeSpan.FromDays(7), [new Claim(ClaimTypes.NameIdentifier, $"{usersDatabaseModel.Id}")]);

        if (!(await _sessionRepository.WhereOneAsync("user_id", usersDatabaseModel.Id, cancellationToken)).Out(
                  out var sessionDatabaseModel))
            await _sessionRepository.Create(usersDatabaseModel.Id, token, cancellationToken);
        else
            await _sessionRepository.Regenerate(usersDatabaseModel.Id, token, cancellationToken);

        response.WriteTJsonToCache(new { token });
    }

    [ControllerHandler("/change_password", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
       typeof(MemberSessionMiddleware))]
    private async Task UsersChangePasswordHandler(Request request, Response response,
       CancellationToken cancellationToken)
    {
        if (!(await validatorManager.ValidFromRequest<ChangePasswordModel>(request, response, cancellationToken))
            .Out(out var changePasswordModel)) return;

        var userDatabaseModel = request.FeatureCollection.Get<UserDatabaseModel>()!;

        if (userDatabaseModel.Password != CryptoUtils.Sha256(changePasswordModel.CurrentPassword))
        {
            response.PushError("Current password is wrong.");
            return;
        }

        if (changePasswordModel.RepeatPassword == changePasswordModel.NewPassword)
        {
            response.PushError("New password not equal with repeat password.");
            return;
        }


        if (!await _userRepository.ChangeWhere("id", userDatabaseModel.Id, "password",
               CryptoUtils.Sha256(changePasswordModel.NewPassword), cancellationToken))
        {
            response.PushError("Wrong change password.");
            return;
        }

        response.WriteStrToCache(string.Empty);
    }


    [ControllerHandler("/logout", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
       typeof(MemberSessionMiddleware))]
    private async Task UsersLogoutHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        var usersDatabaseModel = request.FeatureCollection.Get<UserDatabaseModel>()!;

        if ((await _sessionRepository.Delete("user_id", usersDatabaseModel.Id.ToString(), cancellationToken))
            .Out(out _))
        {
            response.WriteStrToCache("success");
            return;
        }

        response.WriteStrToCache(string.Empty);
    }

    #endregion
}
