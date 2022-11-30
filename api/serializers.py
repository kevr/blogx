from django.contrib.auth.models import User
from rest_framework.serializers import (HyperlinkedModelSerializer,
                                        SerializerMethodField)


class UserSerializer(HyperlinkedModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = User
        fields = ["url", "name", "username", "email"]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
