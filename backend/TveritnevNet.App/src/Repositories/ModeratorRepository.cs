using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class ModeratorRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<ModeratorDatabaseModel>(databaseConnectionFactory) {

   public async Task<Option<ModeratorDatabaseModel>> GetModeratorFromSession(Request request, CancellationToken cancellationToken) {
      var token = request.GetCookie("Token").Content;
      if (string.IsNullOrWhiteSpace(token)) 
         return Option<ModeratorDatabaseModel>.Fail();
      var sessionRepo = new SessionRepository(this.DatabaseConnectionFactory);
      if (!(await sessionRepo.FirstWhere("token", token, cancellationToken)).Out(
             out var sessionDatabaseModel)) {
         return Option<ModeratorDatabaseModel>.Fail();
      }
      var userRepo = new ModeratorRepository(this.DatabaseConnectionFactory);
      return await userRepo.GetFromId(sessionDatabaseModel.UserId, cancellationToken);
   }
   
   public async Task<Option<ModeratorDatabaseModel>> Create(int id, string username, string passwordHash, CancellationToken cancellationToken) {
      try {
         if (await ExistsAsync("username", username, cancellationToken)) 
            return Option<ModeratorDatabaseModel>.Fail();

         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition($"INSERT INTO {TableName} (id, username, password) VALUES (@Id, @Username, @Password ) ON CONFLICT (id) DO NOTHING RETURNING id",
               new {Id=id, Username = username, Password = passwordHash }, cancellationToken: cancellationToken);
         var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
         if (scalarId is < 0) {
            return Option<ModeratorDatabaseModel>.Fail();
         }
         return await this.GetFromId(id, cancellationToken);
      } catch {
         return Option<ModeratorDatabaseModel>.Fail();
      }
   }
}