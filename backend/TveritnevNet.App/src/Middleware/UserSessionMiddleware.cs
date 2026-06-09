using System.Security.Claims;
using Microsoft.Extensions.Logging;
using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Middleware;

using TveritnevNet.App.Models.Enums;
using TveritnevNet.App.Models.Database;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Middleware;

public abstract class UserSessionMiddleware(IDatabaseConnectionFactory databaseConnectionFactory, ILogger<UserSessionMiddleware> logger) : IMiddleware
{
    private readonly SessionRepository _sessionRepo = new(databaseConnectionFactory);
    private readonly UserRepository _userRepo = new(databaseConnectionFactory);
    protected abstract UserDatabaseRole Role { get; }

    public async Task<Option> Invoke(Request request, Response response, CancellationToken cancellationToken)
    {
        if ((!request.User.Identity?.IsAuthenticated ?? false) || !request.GetBearerToken().Out(out var token))
        {
            response.PushError("User undefined.");
            return Option.Fail();
        }


        if (!(await _sessionRepo.WhereOneAsync("token", token, cancellationToken)).Out(out var sessionDatabaseModel))
        {
            response.PushError("Session unedfined.");
            return Option.Fail();
        }

        var id = request.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (id is null || sessionDatabaseModel.UserId.ToString() != id || !long.TryParse(id, out var longId))
        {
            response.PushError("Bad token [id] undefined.");
            return Option.Fail();
        }

        if (!(await _userRepo.WhereOneAsync("id", longId, cancellationToken)).Out(out var userDatabaseModel))
        {
            logger.LogError("JWT Id: {Id}", longId);
            response.PushError("User undefined.");
            return Option.Fail();
        }

        logger.LogInformation($"Auth:\n\tid: {longId}\n\trole: {userDatabaseModel.Role}\nSession:\n\tid:{sessionDatabaseModel.UserId}");

        if (userDatabaseModel.Role < Role)
        {
            response.PushError("Authorization bad, role is lower");
            return Option.Fail();
        }

        request.FeatureCollection.Set<UserDatabaseModel>(userDatabaseModel);
        request.FeatureCollection.Set<SessionDatabaseModel>(sessionDatabaseModel);
        return Option.Ok();
    }
}
