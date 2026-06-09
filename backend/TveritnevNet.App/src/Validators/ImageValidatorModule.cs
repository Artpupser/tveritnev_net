using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Validations;

using SixLabors.ImageSharp;

namespace TveritnevNet.App.Validators;

[InitializatorEye(true)]
public sealed class ImageValidatorModule(ValidatorManager validatorManager) : ValidatorModule(validatorManager)
{
    public override Task<bool> Valid(object? instance, string options, Request request, Response response,
       CancellationToken cancellationToken)
    {
        try
        {
            if (instance is not byte[] bytes) return Task.FromResult(false);
            Image.Identify(bytes);
            return Task.FromResult(true);
        } catch
        {
            return Task.FromResult(false);
        }
    }

    public override string RuleId => "img";
    public override string Message => "This field not image";
}
