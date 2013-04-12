class HomeController < ApplicationController
  before_filter :custom_authenticate_user!
  layout "home"
  
  def index
  end
end
