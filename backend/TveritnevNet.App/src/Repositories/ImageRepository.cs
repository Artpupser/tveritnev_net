using Dapper;

using PupaLib.Core;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Models.Database;

namespace TveritnevNet.App.Repositories;

public sealed class ImageRepository(PublicFolder publicFolder, IDatabaseConnectionFactory databaseConnectionFactory)
   : Repository<ConfigsDatabaseModel>(databaseConnectionFactory)
{
    public async Task<Option> Create(byte[] image, string name, CancellationToken cancellationToken)
    {
        try
        {
            var fileOption = publicFolder.Virtual.GetOrCreateFileIn(name);
            if (!fileOption.Out(out var file))
                return Option.Fail();
            await file.WriteBytesAsync(image, cancellationToken);
            if (file.SizeInBytes != image.Length)
                return Option.Fail();
            var connection = DatabaseConnectionFactory.GetConnection();
            var commandDefinition =
               new CommandDefinition(
                  $"INSERT INTO {TableName} (name) VALUES (@Name) RETURNING id",
                  new { Name = name },
                  cancellationToken: cancellationToken);
            var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
            return scalarId < 0 ? Option.Fail() : Option.Ok();
        } catch
        {
            return Option.Fail();
        }
    }

    public async Task<Option> Delete(string name, CancellationToken cancellationToken)
    {
        try
        {
            var fileOption = publicFolder.Virtual.GetOrCreateFileIn(name);
            if (!fileOption.Out(out var file))
                return Option.Fail();
            file.DeleteMe();
            var connection = DatabaseConnectionFactory.GetConnection();
            var commandDefinition =
               new CommandDefinition(
                  $"DELETE FROM {TableName}WHERE name=@Name RETURNING id",
                  new { Name = name },
                  cancellationToken: cancellationToken);
            var scalarId = await connection.ExecuteScalarAsync<int>(commandDefinition);
            return scalarId < 0 ? Option.Fail() : Option.Ok();
        } catch
        {
            return Option.Fail();
        }
    }
}
