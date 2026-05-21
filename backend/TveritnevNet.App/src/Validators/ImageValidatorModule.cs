using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Validations;

using SixLabors.ImageSharp;

namespace TveritnevNet.App.Validators;

public sealed class ImageValidatorModule : IValidatorModule {
   public Task<bool> Valid(object? instance, string options, Request request, Response response,
      CancellationToken cancellationToken) {
      try {
         if (instance is not byte[] bytes) return Task.FromResult(false);
         Image.Identify(bytes);
         return Task.FromResult(true);
      } catch {
         return Task.FromResult(false);
      }
   }

   public string RuleId => "img";
   public string Message => "This field not image";
}