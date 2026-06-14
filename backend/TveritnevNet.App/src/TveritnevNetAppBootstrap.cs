using PupaMVCF.Framework.Core;
using Microsoft.Extensions.Configuration;
using PupaMVCF.Framework.Database;
using TveritnevNet.App.Bootstrap;

namespace TveritnevNet;

internal sealed class TveritnevNetAppBootstrap(IDatabaseConnectionFactory connectionFactory, PublicFolder publicFolder, IConfiguration configuration) : IWebAppBootstrap
{
    private readonly DatabaseInitializer _databaseInitializer = new(connectionFactory, publicFolder, configuration);
    public Queue<Func<Task>> Operations()
    {
        var queue = new Queue<Func<Task>>();
        queue.Enqueue(Operation);
        return queue;

    }

    private async Task Operation()
    {
        var cts = new CancellationTokenSource();
        await _databaseInitializer.InitUsersInDatabase(cts.Token);
        await _databaseInitializer.InitConfigInDatabase(cts.Token);
    }
}
