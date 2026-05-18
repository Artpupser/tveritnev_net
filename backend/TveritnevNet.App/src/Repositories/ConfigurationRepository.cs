using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class ConfigurationRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<ConfigurationDatabaseModel>(databaseConnectionFactory) {
   public async Task<Option<ConfigurationDatabaseModel>> First(CancellationToken cancellationToken) {
      try
      {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition(commandText: "SELECT * FROM configuration LIMIT 1",
               cancellationToken: cancellationToken);
         var model = await connection.QueryFirstOrDefaultAsync<ConfigurationDatabaseModel>(commandDefinition);
         return model is null
            ? Option<ConfigurationDatabaseModel>.Fail()
            : Option<ConfigurationDatabaseModel>.Ok(model);
      }
      catch 
      {
         return Option<ConfigurationDatabaseModel>.Fail();
      }
   }
   
   public async Task<Option<string>> FirstPanel(CancellationToken cancellationToken) {
      try
      {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition(commandText: "SELECT panel_json FROM configuration LIMIT 1",
               cancellationToken: cancellationToken);
         var model = await connection.QueryFirstOrDefaultAsync<string>(commandDefinition);
         return model is null ? Option<string>.Fail() : Option<string>.Ok(model);
      }
      catch 
      {
         return Option<string>.Fail();
      }
   }
   
   public async Task<Option<string>> FirstSettings(CancellationToken cancellationToken) {
      try
      { 
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition(commandText: "SELECT settings_json FROM configuration LIMIT 1", cancellationToken: cancellationToken);
         var model = await connection.QueryFirstOrDefaultAsync<string>(commandDefinition);
         return model is null ? Option<string>.Fail() : Option<string>.Ok(model);
      } catch 
      {
         return Option<string>.Fail();
      }
   }
}