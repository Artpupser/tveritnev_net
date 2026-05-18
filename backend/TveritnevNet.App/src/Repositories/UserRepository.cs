using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;

namespace VelvetScroll.App.Repositories;

public sealed class UserRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<UserDatabaseModel>(databaseConnectionFactory) {

   public async Task<Option<UserDatabaseModel>> GetUserFromSession(Request request, CancellationToken cancellationToken) {
      var token = request.GetCookie("Token").Content;
      if (string.IsNullOrWhiteSpace(token)) 
         return Option<UserDatabaseModel>.Fail();
      var sessionRepo = new SessionRepository(this.DatabaseConnectionFactory);
      if (!(await sessionRepo.FirstWhere("token", token, cancellationToken)).Out(
             out var sessionDatabaseModel)) {
         return Option<UserDatabaseModel>.Fail();
      }
      var userRepo = new UserRepository(this.DatabaseConnectionFactory);
      return await userRepo.GetFromId(sessionDatabaseModel.UserId, cancellationToken);
   }
   
   public async Task<Option<UserDatabaseModel>> Create(string username, string password_hash, CancellationToken cancellationToken) {
      try {
         if (await ExistsAsync("username", username, cancellationToken)) 
            return Option<UserDatabaseModel>.Fail();

         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition($"INSERT INTO {TableName} (username, password, role) VALUES (@Username, @Password, @Role::user_role) RETURNING id",
               new { Username = username, Password = password_hash, Role = nameof(UserDatabaseModelRole.Admin).ToLower() }, cancellationToken: cancellationToken);
         var id = await connection.ExecuteScalarAsync<int>(commandDefinition);
         if (id is < 0) {
            return Option<UserDatabaseModel>.Fail();
         }
         return await this.GetFromId(id, cancellationToken);
      } catch {
         return Option<UserDatabaseModel>.Fail();
      }
   }
}