# Render
# - Root Directory: server
# - Dockerfile Path: Dockerfile
# - Docker Command: leave empty (uses ENTRYPOINT)
# Health check path: /ping

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/ ./src/

RUN dotnet restore src/Bootstrapper/SafeZone.Bootstrapper/SafeZone.Bootstrapper.csproj

RUN dotnet publish src/Bootstrapper/SafeZone.Bootstrapper/SafeZone.Bootstrapper.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    DOTNET_EnableDiagnostics=0

EXPOSE 8080

COPY --from=build /app/publish .

RUN mkdir -p /app/wwwroot/uploads /app/wwwroot/uploads/profiles /app/logs \
    && chown -R app:app /app

USER app

ENTRYPOINT ["dotnet", "SafeZone.Bootstrapper.dll"]
