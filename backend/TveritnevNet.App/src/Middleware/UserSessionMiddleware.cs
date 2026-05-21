using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Middleware;

using TveritnevNet.App.Models.Database;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Middleware;

public abstract class UserSessionMiddleware(IDatabaseConnectionFactory databaseConnectionFactory) : IMiddleware {
   private readonly SessionRepository _sessionRepository = new(databaseConnectionFactory);
   private readonly UserRepository _userRepository = new(databaseConnectionFactory);
   protected abstract UserDatabaseRole Role { get; }
   public async Task<Option> Invoke(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await _sessionRepository.FirstWhere("token", request.GetCookie("Token"), cancellationToken)).Out(out var sessionDatabaseModel)) {
         return Option.Fail();
      }
      
      if (!(await _userRepository.FirstWhere("id", sessionDatabaseModel.UserId, cancellationToken)).Out(out var usersDatabaseModel)) {
         return Option.Fail();
      }

      if (sessionDatabaseModel.IsExpired() || usersDatabaseModel.IsRole(Role)) {
         return Option.Fail();
      }
      
      request.FeatureCollection.Set<SessionDatabaseModel>(sessionDatabaseModel);
      request.FeatureCollection.Set<UsersDatabaseModel>(usersDatabaseModel);
      return Option.Ok();
   }
}