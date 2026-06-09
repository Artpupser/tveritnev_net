using Microsoft.Extensions.Logging;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Enums;

namespace TveritnevNet.App.Middleware;

[InitializatorEye(true)]
public sealed class MemberSessionMiddleware(IDatabaseConnectionFactory databaseConnectionFactory, ILogger<UserSessionMiddleware> logger)
   : UserSessionMiddleware(databaseConnectionFactory, logger)
{
    protected override UserDatabaseRole Role => UserDatabaseRole.Member;
}
