using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;
using PupaMVCF.Framework.Validations;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Controllers;

[InitializatorEye(true)]
[ControllerScheme("/images")]
public sealed class ImagesController(IValidatorManager validatorManager, PublicFolder publicFolder, IDatabaseConnectionFactory databaseConnectionFactory) : Controller
{
    private readonly ImageRepository _imageRepository = new(publicFolder, databaseConnectionFactory);

    #region POST

    [ControllerHandler("/create", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
       typeof(AdminSessionMiddleware))]
    private async Task ImagesCreateHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await validatorManager.ValidFromRequest<ImageLoadModel>(request, response, cancellationToken)).Out(
               out var imageLoadModel)) return;

        if (!await _imageRepository.Create(imageLoadModel.Image, imageLoadModel.Name, cancellationToken))
        {
            response.PushError("Image creating wrong.");
            return;
        }

        response.WriteStrToCache(string.Empty);
    }

    [ControllerHandler("/delete", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
       typeof(AdminSessionMiddleware))]
    private async Task ImagesDeleteHandler(Request request, Response response, CancellationToken cancellationToken)
    {
        if (!(await validatorManager.ValidFromRequest<ImageDeleteModel>(request, response, cancellationToken))
            .Out(out var imageLoadModel)) return;

        if (!await _imageRepository.Delete(imageLoadModel.Name, cancellationToken))
        {
            response.PushError("Image deleting wrong.");
            return;
        }
        response.WriteStrToCache(string.Empty);
    }

    #endregion
}
