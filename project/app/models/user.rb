class User < ActiveRecord::Base
  require 'bcrypt'
  attr_accessible :password, :email, :password_confirmation
  attr_accessor :password
  before_save :encrypt_password

  validates_confirmation_of :password
  validates :password, :presence => true, :on => :create
  validates :email, :presence => true, :uniqueness => true

  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end

  def self.authenticate(email, password)
    user = find_by_email(email)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end
end
