using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class UserRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<UsersDatabaseModel>(databaseConnectionFactory) {

   public async Task<Option<UsersDatabaseModel>> GetFromSession(Request request, CancellationToken cancellationToken) {
      var token = request.GetCookie("Token").Content;
      if (string.IsNullOrWhiteSpace(token)) 
         return Option<UsersDatabaseModel>.Fail();
      var sessionRepo = new SessionRepository(this.DatabaseConnectionFactory);
      if (!(await sessionRepo.FirstWhere("token", token, cancellationToken)).Out(
             out var sessionDatabaseModel)) {
         return Option<UsersDatabaseModel>.Fail();
      }
      var userRepo = new UserRepository(this.DatabaseConnectionFactory);
      return await userRepo.GetFromId(sessionDatabaseModel.UserId, cancellationToken);
   }

   public Task<Option<UsersDatabaseModel>> CreateAdmin(string username, string password,
      CancellationToken cancellationToken) {
      return Create(username, password, UserDatabaseRole.Admin, cancellationToken);
   }
   
   public Task<Option<UsersDatabaseModel>> CreateMember(string username, string password,
      CancellationToken cancellationToken) {
      return Create(username, password, UserDatabaseRole.Member, cancellationToken);
   }
   
   public async Task<Option<UsersDatabaseModel>> Create(string username, string password, UserDatabaseRole role, CancellationToken cancellationToken) {
      try {
         if (await ExistsAsync("username", username, cancellationToken)) 
            return Option<UsersDatabaseModel>.Fail();

         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition($"INSERT INTO {TableName} (username, password, role) VALUES (@Username, @Password, @Role::user_role) RETURNING id",
               new {Username = username, Password = password, Role = role }, cancellationToken: cancellationToken);
         var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
         if (scalarId is < 0) {
            return Option<UsersDatabaseModel>.Fail();
         }
         return await this.GetFromId(scalarId, cancellationToken);
      } catch {
         return Option<UsersDatabaseModel>.Fail();
      }
   }
}