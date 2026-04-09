using SafeZone.Shared.Abstractions.Queries;

namespace SafeZone.Modules.Payments.Core.Queries.VerifyPayment;

internal record VerifyPaymentQuery (string Reference) : IQuery<string>;