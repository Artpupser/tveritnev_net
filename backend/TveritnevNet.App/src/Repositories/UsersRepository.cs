using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Enums;
using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class UserRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<UserDatabaseModel>(databaseConnectionFactory)
{
    public async Task<Option<UserDatabaseModel>> GetFromSession(Request request, CancellationToken cancellationToken)
    {
        var token = request.GetCookie("Token").Content;
        if (string.IsNullOrWhiteSpace(token))
            return Option<UserDatabaseModel>.Fail();
        var sessionRepo = new SessionRepository(DatabaseConnectionFactory);
        if (!(await sessionRepo.WhereOneAsync("token", token, cancellationToken)).Out(
               out var sessionDatabaseModel))
            return Option<UserDatabaseModel>.Fail();
        var userRepo = new UserRepository(DatabaseConnectionFactory);
        return await userRepo.WhereOneIdAsync(sessionDatabaseModel.UserId, cancellationToken);
    }

    public Task<Option<UserDatabaseModel>> CreateAdmin(string username, string password,
       CancellationToken cancellationToken)
    {
        return Create(username, password, UserDatabaseRole.Admin, cancellationToken);
    }

    public Task<Option<UserDatabaseModel>> CreateMember(string username, string password,
       CancellationToken cancellationToken)
    {
        return Create(username, password, UserDatabaseRole.Member, cancellationToken);
    }

    public async Task<Option<UserDatabaseModel>> Create(string username, string password, UserDatabaseRole role,
       CancellationToken cancellationToken)
    {
        try
        {
            if (await ExistsAsync("username", username, cancellationToken))
                return Option<UserDatabaseModel>.Fail();

            var connection = DatabaseConnectionFactory.GetConnection();
            var commandDefinition =
               new CommandDefinition(
                  $"INSERT INTO {TableName} (username, password, role) VALUES (@Username, @Password, @Role::user_role) RETURNING id",
                  new { Username = username, Password = password, Role = role.ToString().ToLower() },
                  cancellationToken: cancellationToken);
            var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
            if (scalarId is < 0) return Option<UserDatabaseModel>.Fail();
            return await WhereOneIdAsync(scalarId, cancellationToken);
        } catch
        {
            return Option<UserDatabaseModel>.Fail();
        }
    }
}
