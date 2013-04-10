class HomeController < ApplicationController
  before_filter :custom_authenticate_user!
  
  def index
  end
end
