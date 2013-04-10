class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user
  
  private
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  protected
  def custom_authenticate_user!
    if !session[:user_id].nil?
      puts "logged in", session[:user_id]
    else
      redirect_to :controller => "sessions" ,:action => "new"
    end
  end
end
