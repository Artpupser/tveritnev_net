using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models;
using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class ConfigsRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<ConfigurationDatabaseModel>(databaseConnectionFactory) {
   
   public async Task<Option> Create(string name, string json, CancellationToken cancellationToken) {
      try
      {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition(
               commandText: $"INSERT INTO {TableName} (name, json) VALUES (@Name, @Json) RETURNING id",
               parameters: new { Name = name, Json = json },
               cancellationToken: cancellationToken);
         var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
         return scalarId < 0 ? Option.Fail() : Option.Ok();
      }
      catch 
      {
         return Option.Fail();
      }
   }
}