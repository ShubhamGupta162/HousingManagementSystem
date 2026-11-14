using EasyHousingSolution.IdentityService.Application.DTOs;
using FluentValidation;

namespace EasyHousingSolution.IdentityService.Application.Validators;

public class RegisterBuyerDtoValidator : AbstractValidator<RegisterBuyerDto>
{
    public RegisterBuyerDtoValidator()
    {
        RuleFor(x => x.EmailId).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(4);
        RuleFor(x => x.FullName).NotEmpty();
        RuleFor(x => x.MobileNo)
            .NotEmpty().WithMessage("Mobile number is required.")
            .Length(10).WithMessage("Mobile number must be exactly 10 digits.")
            .Matches(@"^[6-9][0-9]{9}$").WithMessage("Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.");
        RuleFor(x => x.Dob)
            .NotEmpty().WithMessage("Date of birth is required.");
    }
}

public class RegisterSellerDtoValidator : AbstractValidator<RegisterSellerDto>
{
    public RegisterSellerDtoValidator()
    {
        RuleFor(x => x.EmailId).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.FullName).NotEmpty();
        RuleFor(x => x.PhoneNo).NotEmpty().Length(10).Matches(@"^[6-9][0-9]{9}$").WithMessage("Phone number must be exactly 10 digits starting with 6, 7, 8, or 9.");
        RuleFor(x => x.Address).NotEmpty();
        RuleFor(x => x)
            .Must(dto => dto.DateofBirth.HasValue || !string.IsNullOrWhiteSpace(dto.Dob))
            .WithMessage("Date of birth is required.");
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
