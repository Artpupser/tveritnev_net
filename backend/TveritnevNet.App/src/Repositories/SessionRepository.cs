using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;


namespace TveritnevNet.App.Repositories;

public sealed class SessionRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<SessionDatabaseModel>(databaseConnectionFactory) {
   public async Task<Option<int>> Delete(string column, string value, CancellationToken cancellationToken) {
      try {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition = new CommandDefinition(
            $"DELETE FROM {TableName} WHERE {column}=@Id RETURNING id",
            new { Id = value },
            cancellationToken: cancellationToken);
         var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
         return scalarId < 0 ? Option<int>.Fail() : Option<int>.Ok(scalarId);
      } catch {
         return Option<int>.Fail();
      }
   }

   public async Task<Option<int>> Create(int userId, string token, CancellationToken cancellationToken) {
      try {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition = new CommandDefinition(
            $"INSERT INTO {TableName} (user_id, token, expired_at) VALUES (@UserId, @Token, @ExpiredAt) RETURNING id",
            new { UserId = userId, Token = token, ExpiredAt = DateTimeOffset.UtcNow.AddDays(10) },
            cancellationToken: cancellationToken);
         var id = await connection.ExecuteScalarAsync<int>(commandDefinition);
         return id < 0 ? Option<int>.Fail() : Option<int>.Ok(id);
      } catch {
         return Option<int>.Fail();
      }
   }

   public async Task<Option<int>> Regenerate(int userId, string token, CancellationToken cancellationToken) {
      try {
         if (!(await FirstWhere("user_id", userId, cancellationToken)).Out(out var sessionDatabaseModel))
            return Option<int>.Fail();
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition = new CommandDefinition(
            $"UPDATE {TableName} SET token = @Token, updated_at = NOW() WHERE id = @Id RETURNING id",
            new { Token = token, Id = sessionDatabaseModel.Id },
            cancellationToken: cancellationToken);
         var id = await connection.ExecuteScalarAsync<int>(commandDefinition);
         return id < 0 ? Option<int>.Fail() : Option<int>.Ok(id);
      } catch {
         return Option<int>.Fail();
      }
   }
}