using PupaMVCF.Framework.Core;
using Microsoft.Extensions.Configuration;
using PupaMVCF.Framework.Database;
using TveritnevNet.App.Bootstrap;

namespace TveritnevNet;

internal sealed class TveritnevNetAppBootstrap(IDatabaseConnectionFactory connectionFactory, PublicFolder publicFolder, IConfiguration configuration) : IWebAppBootstrap
{
    private readonly DatabaseInitializator _databaseInitializator = new(connectionFactory, publicFolder, configuration);
    public Queue<Func<Task>> Operations()
    {
        var queue = new Queue<Func<Task>>();
        queue.Enqueue(Operation);
        return queue;

    }

    private async Task Operation()
    {
        var cts = new CancellationTokenSource();
        await _databaseInitializator.InitUsersInDatabase(cts.Token);
        await _databaseInitializator.InitConfigInDatabase(cts.Token);
    }
}
