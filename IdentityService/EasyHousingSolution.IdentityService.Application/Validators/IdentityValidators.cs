using EasyHousingSolution.IdentityService.Application.DTOs;
using FluentValidation;

namespace EasyHousingSolution.IdentityService.Application.Validators;

public class RegisterBuyerDtoValidator : AbstractValidator<RegisterBuyerDto>
{
    public RegisterBuyerDtoValidator()
    {
        RuleFor(x => x.EmailId).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.FullName).NotEmpty();
        RuleFor(x => x.PhoneNo).NotEmpty().Length(10);
    }
}
