defmodule Notifier.Notification do
  @moduledoc """
  A Notification will be an email notification to begin with.
  Later on if there's the need to notifiy via anything other than email, I'll work on it.
  """
  use Notifier.Schema

  schema "notifications" do
    field(:to, :string)
    field(:title, :string)
    field(:body, :string)
    field(:notify_at, :naive_datetime)
    field(:status, NotificationStatusEnum, default: :pending)
    field(:failure_reason, :string)
    field(:try_deliver_at, :naive_datetime)

    timestamps()
  end

  @required_create_fields ~w(to title body notify_at)a

  def create_changeset(struct, params) do
    struct
    |> cast(params, @required_create_fields)
    |> validate_required(@required_create_fields)
  end

  def deliver_changeset(struct, dt \\ Notifier.DT) do
    change(struct, status: :delivered, try_deliver_at: dt.now())
  end

  def deliver_failed_changeset(struct, reason, dt \\ Notifier.DT) do
    change(
      struct,
      status: :failed,
      failure_reason: reason,
      try_deliver_at: dt.now()
    )
  end
end
