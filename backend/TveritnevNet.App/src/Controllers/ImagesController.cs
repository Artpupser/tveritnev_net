using PupaMVCF.Framework.Controllers;
using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Database;

using TveritnevNet.App.Middleware;
using TveritnevNet.App.Models;
using TveritnevNet.App.Repositories;

namespace TveritnevNet.App.Controllers;

public sealed class ImagesController(IDatabaseConnectionFactory databaseConnectionFactory) : Controller {
   private readonly ImageRepository _imageRepository = new(databaseConnectionFactory);

   #region POST

   [ControllerHandler("/images/create", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
      typeof(AdminSessionMiddleware))]
   private async Task ImagesCreateHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ImageLoadModel>(request, response, cancellationToken)).Out(out var imageLoadModel)) {
         return;
      }

      if (!(await _imageRepository.Create(imageLoadModel.Image, imageLoadModel.Name, cancellationToken))) {
         response.PushError("Image creating wrong.");
         return;
      }

      response.WriteStrToCache("success");
   }
   
   [ControllerHandler("/images/delete", HttpMethodType.POST, typeof(ModifyLoggerMiddleware),
      typeof(AdminSessionMiddleware))]
   private async Task ImagesDeleteHandler(Request request, Response response, CancellationToken cancellationToken) {
      if (!(await WebApp.Context.Validator.ValidFromRequest<ImageDeleteModel>(request, response, cancellationToken)).Out(out var imageLoadModel)) {
         return;
      }
      
      if (!(await _imageRepository.Delete(imageLoadModel.Name, cancellationToken))) {
         response.PushError("Image deleting wrong.");
         return;
      }
   }

   #endregion
}