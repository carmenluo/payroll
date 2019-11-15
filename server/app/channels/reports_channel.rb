class ReportsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_for 'report_channel'
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
  def receive(data)
    # reports = Report.order('employee_id, pay_start_date').all
    socket = {text: 'please reload'}
    # ActionCable.server.broadcast('text', "please reload")
    ReportsChannel.broadcast_to('report_channel', socket)
  end
end
