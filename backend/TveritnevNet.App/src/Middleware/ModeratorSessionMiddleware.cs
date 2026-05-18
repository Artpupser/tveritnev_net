using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Middleware;

using TveritnevNet.App.Models.Database;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Middleware;

public sealed class ModeratorSessionMiddleware(IDatabaseConnectionFactory databaseConnectionFactory) : IMiddleware {
   private readonly SessionRepository _sessionRepository = new SessionRepository(databaseConnectionFactory);
   private readonly ModeratorRepository _moderatorRepository = new ModeratorRepository(databaseConnectionFactory);
   public async Task<Option> Invoke(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await _sessionRepository.FirstWhere("token", request.GetCookie("Token"), cancellationToken)).Out(out var sessionDatabaseModel)) {
         return Option.Fail();
      }
      
      if (!(await _moderatorRepository.FirstWhere("id", sessionDatabaseModel.UserId, cancellationToken)).Out(out var moderatorDatabaseModel)) {
         return Option.Fail();
      }

      if (sessionDatabaseModel.IsExpired()) {
         return Option.Fail();
      }
      
      request.FeatureCollection.Set<SessionDatabaseModel>(sessionDatabaseModel);
      request.FeatureCollection.Set<ModeratorDatabaseModel>(moderatorDatabaseModel);
      return Option.Ok();
   }
}