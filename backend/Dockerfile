FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY . ./
COPY ./TveritnevNet.App/.env /app/out/.env

RUN dotnet restore
RUN dotnet publish -c Release -r linux-x64 --no-self-contained -p:InvariantGlobalization=true -p:PublishReadyToRun=true -p:StripSymbols=true -p:DebugType=None -p:DebugSymbols=false -o /app/out 

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV DOTNET_TieredCompilation=1
COPY --from=build /app/out .
EXPOSE 50501
ENTRYPOINT ["./TveritnevNet.App"]
