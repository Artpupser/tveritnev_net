using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models;
using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class ConfigurationRepository(IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<ConfigurationDatabaseModel>(databaseConnectionFactory) {

   public async Task<Option> Refresh(ConfigurationModel configurationModel, int whereId, CancellationToken cancellationToken) {
      try
      {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition(
               commandText: $"UPDATE {TableName} SET panel_json=@PanelJson,settings_json=@SettingsJson WHERE id=@Id",
               parameters: new
                  { PanelJson = configurationModel.PanelJson, SettingsJson = configurationModel.SettingsJson, Id=whereId },
               cancellationToken: cancellationToken);
         var id = await connection.ExecuteAsync(commandDefinition);
         return id is < 0
            ? Option.Fail()
            : Option.Ok();
      }
      catch 
      {
         return Option.Fail();
      }
   }
   
   public async Task<Option> CreateSafe(string panelJson, string settingsJson, CancellationToken cancellationToken) {
      try
      {
         var connection = DatabaseConnectionFactory.GetConnection();
         var commandDefinition =
            new CommandDefinition(
               commandText: $"INSERT INTO {TableName} (panel_json, settings_json) VALUES (@PanelJson, @SettingsJson) RETURNING id",
               parameters: new
                  { PanelJson = panelJson, SettingsJson = settingsJson },
               cancellationToken: cancellationToken);
         var scalarId = await connection.ExecuteScalarAsync(commandDefinition);
         return scalarId is < 0
            ? Option.Fail()
            : Option.Ok();
      }
      catch 
      {
         return Option.Fail();
      }
   }
   
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