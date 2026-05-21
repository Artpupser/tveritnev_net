using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Middleware;

public sealed class MemberSessionMiddleware(IDatabaseConnectionFactory databaseConnectionFactory) : UserSessionMiddleware(databaseConnectionFactory) {
   protected override UserDatabaseRole Role => UserDatabaseRole.Admin;
}