from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

# Corrected Spotify API URLs
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1/me/"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens.first()
    return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    # Convert expires_in (seconds) to a datetime object
    expires_in_datetime = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in_datetime
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in_datetime
        )
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        # Check if the token is expired or about to expire
        if tokens.expires_in <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False


def refresh_spotify_token(session_id):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return

    response = post(SPOTIFY_TOKEN_URL, data={
        'grant_type': 'refresh_token',
        'refresh_token': tokens.refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    # Spotify may or may not send a new refresh token. Use the new one if available.
    new_refresh_token = response.get('refresh_token', tokens.refresh_token)

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, new_refresh_token)


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if not tokens:
        return {'Error': 'No tokens found'}

    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + tokens.access_token}
    
    # Execute the correct request type and capture the response
    if post_:
        response = post(SPOTIFY_API_BASE_URL + endpoint, headers=headers)
    elif put_:
        response = put(SPOTIFY_API_BASE_URL + endpoint, headers=headers)
    else:
        response = get(SPOTIFY_API_BASE_URL + endpoint, headers=headers)

    # Handle responses that don't have content (like play, pause)
    if not response.text:
        return {'status': 'success', 'code': response.status_code}

    try:
        return response.json()
    except:
        return {'Error': 'An error occurred with the request'}


def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)


def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)