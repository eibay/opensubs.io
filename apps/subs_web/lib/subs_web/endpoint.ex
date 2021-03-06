defmodule SubsWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :subs_web

  if Application.get_env(:subs, :sql_sandbox) do
    plug Phoenix.Ecto.SQL.Sandbox
  end

  socket "/socket", SubsWeb.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :subs_web, gzip: false,
    only_matching: ~w(css fonts images js favicon.ico robots.txt app.bundle vendor.bundle .well-known)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  plug Plug.Session,
    store: :cookie,
    secure: true,
    encrypt: true,
    key: Application.get_env(:subs_web, SubsWeb.Endpoint)[:session_cookie_name] || "_subs_web_key",
    signing_salt: Application.get_env(:subs_web, SubsWeb.Endpoint)[:session_cookie_signing_salt] || "gHcD7ZWY",
    encryption_salt: Application.get_env(:subs_web, SubsWeb.Endpoint)[:session_cookie_encryption_salt]

  plug SubsWeb.Router

  @doc """
  Callback invoked for dynamically configuring the endpoint.

  It receives the endpoint configuration and checks if
  configuration should be loaded from the system environment.
  """
  def init(_key, config) do
    if config[:load_from_system_env] do
      port = System.get_env("PORT") || raise "expected the PORT environment variable to be set"
      {:ok, Keyword.put(config, :http, [:inet6, port: port])}
    else
      {:ok, config}
    end
  end
end
