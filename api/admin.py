from django.contrib import admin

from .models import Post, Profile, Social


class SocialInline(admin.TabularInline):
    model = Social


class ProfileAdmin(admin.ModelAdmin):
    inlines = [SocialInline]
    model = Profile


admin.site.register(Post)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Social)
