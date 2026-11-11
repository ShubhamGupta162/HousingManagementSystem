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

public class RegisterSellerDtoValidator : AbstractValidator<RegisterSellerDto>
{
    public RegisterSellerDtoValidator()
    {
        RuleFor(x => x.EmailId).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.FullName).NotEmpty();
        RuleFor(x => x.PhoneNo).NotEmpty().Length(10);
        RuleFor(x => x.Address).NotEmpty();
    }
}

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.EmailId).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}
