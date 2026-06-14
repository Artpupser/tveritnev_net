using System.Text.RegularExpressions;

using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Validations;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Controllers;

[InitializatorEye(true)]
[ControllerScheme("/configs")]
public sealed class ConfigsController : Controller
{
    private readonly UserRepository _userRepository;
    private readonly SessionRepository _sessionRepository;
    private readonly ConfigsRepository _configsRepository;
    private readonly IValidatorManager _validatorManager;
    private readonly string[] _wrongWords = ["admin", "moderator", "default"];
    private readonly string _pattern;

    public ConfigsController(IValidatorManager validatorManager, IDatabaseConnectionFactory databaseConnectionFactory)
    {
        _userRepository = new UserRepository(databaseConnectionFactory);
        _sessionRepository = new SessionRepository(databaseConnectionFactory);
        _configsRepository = new ConfigsRepository(databaseConnectionFactory);
        _validatorManager = validatorManager;
        _pattern = $"({string.Join("|", _wrongWords.Select(Regex.Escape))})";
    }

    #region GET

    [ControllerHandler("/load", HttpMethodType.POST, typeof(ModifyLoggerMiddleware), typeof(AdminSessionMiddleware))]
    private async Task GetConfigsLoadHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await _validatorManager.ValidFromRequest<ConfigLoadModel>(request, response, cancellationToken)).Out(
               out var configLoadModel)) return;

        if (CheckWrongWords(configLoadModel.Name))
        {
            response.PushError("Your query contains prohibited words.");
            return;
        }

        if (!(await _configsRepository.WhereOneAsync("name", configLoadModel.Name, cancellationToken)).Out(
               out var configsDatabaseModel))
        {
            response.PushError("Error load config from storage.");
            return;
        }

        response.WriteTJsonToCache(configsDatabaseModel);
    }

    [ControllerHandler("/site", HttpMethodType.GET, typeof(ModifyLoggerMiddleware))]
    private async Task GetConfigsSiteHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await _configsRepository.WhereOneAsync("name", "site", cancellationToken)).Out(out var configsDatabaseModel))
        {
            response.PushError("Error load config from storage.");
            return;
        }
        response.WriteTJsonToCache(configsDatabaseModel);
    }

    [ControllerHandler("/default", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
       typeof(AdminSessionMiddleware))]
    private async Task
       GetConfigsDefaultHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await _validatorManager.ValidFromRequest<ConfigLoadModel>(request, response, cancellationToken)).Out(
               out var configLoadModel)) return;

        if (!(await _configsRepository.WhereOneAsync("name", $"default_{configLoadModel.Name}", cancellationToken)).Out(
               out var configsDatabaseModel))
        {
            response.PushError("Error load config from storage.");
            return;
        }

        response.WriteTJsonToCache(configsDatabaseModel);
    }

    #endregion

    #region POST

    [ControllerHandler("/save", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
       typeof(AdminSessionMiddleware))]
    private async Task ConfigsSavePanelHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await _validatorManager.ValidFromRequest<ConfigSaveModel>(request, response, cancellationToken)).Out(
               out var configSaveModel)) return;

        if (CheckWrongWords(configSaveModel.Name))
        {
            response.PushError("Your query contains prohibited words.");
            return;
        }

        if (await _configsRepository.ChangeWhere("name", configSaveModel.Name, "json", configSaveModel.Json,
               cancellationToken))
        {
            response.WriteStrToCache(string.Empty);
            return;
        }

        response.PushError("Change config is wrong.");
    }

    #endregion

    private bool CheckWrongWords(string content)
    {
        return Regex.IsMatch(content, _pattern, RegexOptions.IgnoreCase);
    }
}
