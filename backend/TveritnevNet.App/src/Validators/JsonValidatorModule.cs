using System.Text.Json;

using PupaMVCF.Framework.Core;
using PupaMVCF.Framework.Validations;

namespace TveritnevNet.App.Validators;

public sealed class JsonValidatorModule : IValidatorModule {
   public string RuleId => "json";
   public string Message => "This object not json";
   
   public Task<bool> Valid(object? instance, string options, Request request, Response response, CancellationToken cancellationToken) {
      try {
         if (instance is not string str) {
            return Task.FromResult(false);
         }
         JsonDocument.Parse(str);
         return Task.FromResult(true);
      } catch {
         return Task.FromResult(false);
      }
   }

}